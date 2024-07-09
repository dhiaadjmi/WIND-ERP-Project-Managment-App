package winderp.authentication.user;

import freemarker.template.TemplateException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;


import freemarker.template.Configuration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestParam;
import winderp.authentication.config.JwtService;

import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CompanyService implements CompanyServiceInterface{

    private final UserRepository userRepository;
    private final CompanyMapper companyMapper;
    private final PasswordEncoder passwordEncoder;

    private final JavaMailSender mailSender;
    private final Configuration freemarkerConfig;
    private final JwtService jwtService;


    public CompanyService(UserRepository userRepository, CompanyMapper companyMapper,PasswordEncoder passwordEncoder, JwtService jwtService,JavaMailSender mailSender,
                          @Qualifier("customFreeMarkerConfiguration") Configuration freemarkerConfig) {
        this.userRepository = userRepository;
        this.companyMapper = companyMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailSender = mailSender;
        this.freemarkerConfig = freemarkerConfig;


    }

    @Override
    public CompanyDto saveCompany(CompanyDto companyDto) {


        User user = companyMapper.dtoToModel(companyDto);
        user.setRole(Role.COMPANY);
        user.setArchived(false);
        user.setEnabled(true);
        user.setValidate(false);
        user.setEmailVerified(false);

        String verificationToken = generateVerificationToken();

        user.setVerificationToken(verificationToken);
        user.setTokenExpiryDate(LocalDateTime.now().plusMinutes(30));
        user.setProfileImageUrl( "avatar.jpeg");

        User savedUser = userRepository.save(user);

        sendVerificationEmail(savedUser);

        CompanyDto savedCompanyDto = companyMapper.modelToDto(savedUser);


        return savedCompanyDto;
    }

 /**
  @Override
  public List<CompanyDto> findAllCompanies() {
      return userRepository.findAll()
              .stream()
              .filter(user -> user.getRole() == Role.COMPANY)
              .map(companyMapper::modelToDto)
              .collect(Collectors.toList());
  }
  */
 @Override
 public List<CompanyDto> findAllCompanies() {
     List<User> activeCompanies = userRepository.findAllByRoleAndArchivedFalse(Role.COMPANY);
     return companyMapper.modelsToDtos(activeCompanies);
 }


    @Override
    public CompanyDto findCompanyById(Integer id) {
        return userRepository.findById(id)
                .map(companyMapper::modelToDto)
                .orElse(null);
    }

@Override
    public void deleteCompany(Integer id) {
        userRepository.deleteById(id);
    }
    /**
    @Override
    public CompanyDto updateCompany(Integer id, CompanyDto updatedCompanyDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not defined with ID : " + id));

        companyMapper.updateCompanyFromDto(updatedCompanyDto, existingUser);

        if (updatedCompanyDto.getPassword() != null && !updatedCompanyDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedCompanyDto.getPassword()));
        }

        User updatedUser = userRepository.save(existingUser);

        return companyMapper.modelToDto(updatedUser);
    }
*/
    @Override
    public CompanyDto updateCompany(Integer id, CompanyDto updatedCompanyDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not defined with ID : " + id));

        if (updatedCompanyDto.getPassword() != null && !updatedCompanyDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedCompanyDto.getPassword()));
        }

        if (updatedCompanyDto.companyName() != null) {
            existingUser.setCompanyName(updatedCompanyDto.companyName());
        }

        if (updatedCompanyDto.sector() != null) {
            existingUser.setSector(updatedCompanyDto.sector());
        }

        if (updatedCompanyDto.size() != null) {
            existingUser.setSize(updatedCompanyDto.size());
        }
        if (updatedCompanyDto.phoneNumber() != null) {
            existingUser.setPhoneNumber(updatedCompanyDto.phoneNumber());
        }

        User updatedUser = userRepository.save(existingUser);

        return companyMapper.modelToDto(updatedUser);
    }
    @Override
    public void archiveCompany(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company introuvable avec l'ID : " + id));
        user.setArchived(true);
        userRepository.save(user);
    }
    @Override
    public void unarchiveCompany(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company introuvable avec l'ID : " + id));
        user.setArchived(false);
        userRepository.save(user);
    }


    private String generateRandomPassword() {
        int length = 10;

        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * characters.length());
            password.append(characters.charAt(index));
        }

        return password.toString();
    }

    @Override
    public void validateCompany(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            if (!user.getEmailVerified()) {
                throw new EmailNotVerifiedException("L'email de cette entreprise n'est pas encore vérifié.");
            }

            if (!user.isValidate()) {
                String generatedPassword = generateRandomPassword();
                sendPasswordByEmail(user.getEmail(), generatedPassword);

                user.setValidate(true);
                user.setPassword(passwordEncoder.encode(generatedPassword));
                userRepository.save(user);
            }
        });
    }


    @Override
    public void sendPasswordByEmail(String email, String generatedPassword) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("windconsultingagile2024@gmail.com");
            helper.setTo(email);
            helper.setSubject("Your Company Password");


            String htmlBody = "<html><body style=\"font-family: Arial, sans-serif;\">" +
                    "<div style=\" padding: 20px;\">" +
                    "<img src=\"cid:companyLogo\" alt=\"Company Logo\" width=\"200\" height=\"100\" style=\"margin: 0 auto; display: block;text-align: center;\">" +
                    "<p style=\"font-size: 24px; color: #00095E;\">Dear Company,</p>" +
                    "<p style=\"font-size: 18px; color: #00095E;\">Thank you for choosing Wind Consulting. Your company account has been successfully created.</p>" +
                    "<p style=\"font-size: 18px; color: #00095E;\">Below is your temporary password:</p>" +
                    "<p style=\"font-size: 28px; font-weight: bold; color: #00095E;text-align: center;\">" + generatedPassword + "</p>" +
                    "<p style=\"font-size: 18px; color: #00095E;\">Please login to your account and change your password for security purposes.</p>" +
                    "<p style=\"font-size: 18px; color: #00095E;\">Best regards,</p>" +
                    "<p style=\"font-size: 18px; color: #00095E;\">Wind Consulting Team</p>" +
                    "</div>" +
                    "</body></html>";

            helper.setText(htmlBody, true);

            ClassPathResource image = new ClassPathResource("images/lw5.png");
            helper.addInline("companyLogo", image);

            mailSender.send(message);

            System.out.println("Password sent successfully...");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }





/**

    @Override
    public void sendPasswordByEmail(String email, String generatedPassword) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("windconsultingagile2024@gmail.com");
    message.setTo(email);
    message.setSubject("Your Company Password");

        String emailBody = String.format("<html><body>" +
                "<p>Dear Company,</p><br>" +
                "<p>Thank you for choosing Wind Consulting. Your company account has been successfully created.</p>" +
                "<p>Below is your temporary password:</p>" +
                "<p><strong>%s</strong></p><br>" +
                "<p>Please login to your account and change your password for security purposes.</p><br>" +
                "<p>Best regards,</p>" +
                "<p>Wind Consulting Team</p>" +
                "</body></html>", generatedPassword);


        message.setText(emailBody);
    mailSender.send(message);

    System.out.println("Password sent successfully...");
    }
*/


    @Override
    public void invalidateCompany(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
            user.setValidate(false);
            user.setPassword("");
            userRepository.save(user);
        });
    }

@Override
public ResponseEntity<String> resetPassword(String email) {
    try {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            String newPassword = generateRandomPassword();

            user.setPassword(passwordEncoder.encode(newPassword));

            userRepository.save(user);

            sendPasswordByEmail(user.getEmail(), newPassword);

            return new ResponseEntity<>("Nouveau mot de passe envoyé avec succès à " + email, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Aucun utilisateur trouvé avec l'adresse e-mail fournie", HttpStatus.NOT_FOUND);
        }
    } catch (Exception e) {
        return new ResponseEntity<>("Une erreur s'est produite lors de la réinitialisation du mot de passe.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}








    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    private String generateVerificationLink(User user) {
        return "http://localhost:4200/authentication/verifyemail?email=" + user.getEmail() +
                "&token=" + user.getVerificationToken();
    }
  /**  public void sendVerificationEmail(User user) {
        String verificationLink = generateVerificationLink(user);
        String emailContent = "Cliquez sur le lien suivant pour vérifier votre adresse e-mail: " + verificationLink;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("windconsultingagile2024@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("Vérification de l'adresse e-mail");
        message.setText(emailContent);

        mailSender.send(message);

        System.out.println("Email de vérification envoyé avec succès...");
    }
   */
  public void sendVerificationEmail(User user) {
      String verificationLink = generateVerificationLink(user);

      MimeMessage message = mailSender.createMimeMessage();

      try {
          MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
          helper.setFrom("windconsultingagile2024@gmail.com");
          helper.setTo(user.getEmail());
          helper.setSubject("Vérification de l'adresse e-mail");

          String htmlBody = "<html><body style=\"font-family: Arial, sans-serif;\">" +
                  "<div style=\"padding: 20px;\">" +
                  "<p style=\"font-size: 24px; color: #00095E;\">Dear " + user.getCompanyName() + ",</p>" +
                  "<p style=\"font-size: 18px; color: #00095E;\">Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>" +
                  "<a href=\"" + verificationLink + "\" style=\"font-size: 18px; color: #00095E;\">" + verificationLink + "</a>" +
                  "<p style=\"font-size: 18px; color: #00095E;\">Ce lien expirera dans 30 minutes.</p>" +
                  "<p style=\"font-size: 18px; color: #00095E;\">Best regards,</p>" +
                  "<p style=\"font-size: 18px; color: #00095E;\">Wind Consulting Team</p>" +
                  "</div>" +
                  "</body></html>";

          helper.setText(htmlBody, true);

          mailSender.send(message);

          System.out.println("Email de vérification envoyé avec succès...");
      } catch (MessagingException e) {
          e.printStackTrace();
      }
  }

    @Override
    public ResponseEntity<String> verifyEmail(@RequestParam("email") String email,
                                              @RequestParam("token") String token) {
        System.out.println("Email: " + email);
        System.out.println("Token: " + token);
        Optional<User> userOptional = userRepository.findByEmailAndVerificationToken(email, token);
        if (userOptional.isPresent() && isTokenValid(userOptional.get())) {
            User user = userOptional.get();
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            user.setTokenExpiryDate(null);

            try {
                userRepository.save(user);
                System.out.println("User saved successfully with updated fields.");
                return new ResponseEntity<>("Email vérifié avec succès. Compte ajouté.", HttpStatus.OK);
            } catch (Exception e) {
                System.err.println("Error saving user: " + e.getMessage());
                return new ResponseEntity<>("Erreur lors de la sauvegarde de l'utilisateur.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>("Lien de vérification d'e-mail invalide.", HttpStatus.BAD_REQUEST);
        }
    }

    private boolean isTokenValid(User user) {
        return user.getTokenExpiryDate().isAfter(LocalDateTime.now());
    }
    @Override
    public List<CompanyDto> findAllCompanyByCompanyName(String keyword) {
        List<User> users = userRepository.findAllByCompanyNameContainingAndArchivedFalse(keyword);
        return users.stream()
                .map(companyMapper::modelToDto)
                .collect(Collectors.toList());
    }

}
