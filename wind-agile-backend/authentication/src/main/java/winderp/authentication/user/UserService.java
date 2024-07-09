package winderp.authentication.user;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.jpa.repository.Query;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import winderp.authentication.config.JwtService;
import winderp.authentication.team.Team;
import winderp.authentication.team.TeamMapper;
import winderp.authentication.team.TeamRepository;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements UserServiceInterface {
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final UserMapper userMapper;
    private final TeamMapper teamMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JavaMailSender mailSender;
    @Autowired
    private ResourceLoader resourceLoader;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, JwtService jwtService,TeamRepository teamRepository,TeamMapper teamMapper
  ,JavaMailSender mailSender ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.teamRepository = teamRepository;
        this.teamMapper=teamMapper;
        this.mailSender=mailSender;
    }


/**    @Override
    public UserDto saveUser(UserDto userDto) {
        User user = userMapper.dtoToModel(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(Role.USER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        UserDto savedUserDto = userMapper.modelToDto(savedUser);

        return savedUserDto;
    }
*/

/**
@Override
public UserDto saveUser(UserDto userDto, Integer companyIdentifier) {
    User user = userMapper.dtoToModel(userDto);
    user.setPassword(passwordEncoder.encode(userDto.getPassword()));
    user.setRole(Role.USER);
    user.setEnabled(true);
    user.setCompanyIdentifier(companyIdentifier);

    User savedUser = userRepository.save(user);

    UserDto savedUserDto = userMapper.modelToDto(savedUser);

    return savedUserDto;
}
*/
@Override
public UserDto saveUser(UserDto userDto, Integer companyIdentifier) {
    Optional<User> companyUserOptional = userRepository.findByIdAndRole(companyIdentifier, Role.COMPANY);

    if (companyUserOptional.isPresent()) {
        User user = userMapper.dtoToModel(userDto);
      //  user.setPassword(passwordEncoder.encode("winderp")); // Définition du mot de passe commun

        //  user.setPassword(passwordEncoder.encode(userDto.getPassword()));
      //  user.setRole(Role.USER);
        user.setEnabled(true);
        user.setArchived(false);
user.setProfileImageUrl( "avatar.jpeg");
        user.setCompanyIdentifier(companyIdentifier);

        User savedUser = userRepository.save(user);
        sendPassword(savedUser.getId());

        UserDto savedUserDto = userMapper.modelToDto(savedUser);

        return savedUserDto;
    } else {
        throw new RuntimeException("Aucune entreprise trouvée avec l'identifiant : " + companyIdentifier);
    }
}

  @Override
    public List<UserDto> findAllUsers() {

       List<User> users =  userRepository.findAllByRole(Role.EMPLOYEE);
        return userMapper.modelsToDtos(users);

    }

    @Override
    public UserDto findUserById(Integer id) {
        return userRepository.findById(id)
                .map(userMapper::modelToDto)
                .orElse(null);
    }

    @Override
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
/**
    @Override
    public UserDto updateUser(Integer id, UserDto updatedUserDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));

        userMapper.updateUserFromDto(updatedUserDto, existingUser);

        User updatedUser = userRepository.save(existingUser);

        return userMapper.modelToDto(updatedUser);
    }*/
    @Override
    public UserDto updateUser(Integer id, UserDto updatedUserDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not defined with ID : " + id));

        if (updatedUserDto.firstname() != null) {
            existingUser.setFirstname(updatedUserDto.firstname());
        }


        if (updatedUserDto.lastname() != null) {
            existingUser.setLastname(updatedUserDto.lastname());
        }
        if (updatedUserDto.getPassword() != null && !updatedUserDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUserDto.getPassword()));
        }

        if (updatedUserDto.job() != null) {
            existingUser.setJob(updatedUserDto.job());
        }
        if (updatedUserDto.role() != null) {
            existingUser.setRole(updatedUserDto.role());
        }
        if (updatedUserDto.phoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUserDto.phoneNumber());
        }
        if (updatedUserDto.cin() != null) {
            existingUser.setCin(updatedUserDto.cin());
        }

        User updatedUser = userRepository.save(existingUser);

        return userMapper.modelToDto(updatedUser);
    }
    public void addTeamToUser(UserDto userDto, Long teamId) {
        User user = userMapper.dtoToModel(userDto);
        Optional<Team> teamOptional = teamRepository.findById(teamId);

        if (teamOptional.isPresent()) {
            Team team = teamOptional.get();

            Optional<User> userOptional = userRepository.findById(user.getId());
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();

                if (!existingUser.getTeams().contains(team)) {
                    existingUser.getTeams().add(team);
                    team.getUsers().add(existingUser);
                    userRepository.save(existingUser);
                    teamRepository.save(team);
                }
            } else {
                System.out.println("Utilisateur non trouvé avec l'ID : " + user.getId());
            }
        } else {
            System.out.println("Équipe non trouvée avec l'ID : " + teamId);
        }
    }
    /**
    @Override
    public List<UserDto> findAllUsersByCompany(Integer companyIdentifier) {
        List<User> users = userRepository.findAllByCompanyIdentifier(companyIdentifier);
        return userMapper.modelsToDtos(users);
    }
     */
    @Override
    public List<UserDto> findAllUsersByCompany(Integer companyIdentifier) {
        List<User> activeUsers = userRepository.findAllByCompanyIdentifierAndArchivedFalse(companyIdentifier);
        return userMapper.modelsToDtos(activeUsers);
    }
    @Override
    public List<UserDto> findLeadersByCompany(Integer companyIdentifier) {
        List<User> leaders = userRepository.findByRoleAndCompanyIdentifier(Role.LEADER, companyIdentifier);
        return userMapper.modelsToDtos(leaders);
    }
    @Override
    public List<UserDto> findEmployeesByCompany(Integer companyIdentifier) {
        List<User> leaders = userRepository.findByRoleAndCompanyIdentifier(Role.EMPLOYEE, companyIdentifier);
        return userMapper.modelsToDtos(leaders);
    }


    @Override
    public void archiveUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));
        user.setArchived(true);
        userRepository.save(user);
    }
    @Override
    public void unarchiveUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));
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
    public void sendPasswordByEmail(String email, String generatedPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("windconsultingagile2024@gmail.com");
        message.setTo(email);
        message.setSubject("Your  Password");

        String emailBody = String.format("Dear Employee,\n\n" +
                "Thank you for choosing Wind Consulting for work. Your work account has been successfully created.\n" +
                "Below is your temporary password:\n\n%s\n\n" +
                "Please login to your account and change your password for security purposes.\n\n" +
                "Best regards,\n" +
                "Wind Consulting RH", generatedPassword);

        message.setText(emailBody);
        mailSender.send(message);

        System.out.println("Password sent successfully...");
    }
    @Override
    public void sendPassword(Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.ifPresent(user -> {
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
    public UserDto saveAdmin(UserDto userDto) {
        User user = userMapper.dtoToModel(userDto);
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        user.setPassword(encodedPassword);
        user.setRole(Role.ADMIN);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);
        UserDto savedUserDto = userMapper.modelToDto(savedUser);
        return savedUserDto;
    }

    @Override
    public void uploadProfileImage(MultipartFile file, String fileName, Integer userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Empty file");
        }

        String imageUrl = saveImage(file, fileName);

        user.setProfileImageUrl(fileName);
        userRepository.save(user);
    }


    @Override
    public String saveImage(MultipartFile imageFile, String fileName) throws IOException {
        String absolutePath = "/Users/macbook/IdeaProjects/micro-services-windErp/authentication/src/main/resources/images";
        Path directoryPath = Paths.get(absolutePath);

        if (!Files.exists(directoryPath)) {
            try {
                Files.createDirectories(directoryPath);
            } catch (IOException e) {
                throw new RuntimeException("Unable to create directory: " + absolutePath, e);
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }
        }

        Path filePath = directoryPath.resolve(fileName);

        try {
            Files.write(filePath, imageFile.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Unable to write file to path: " + filePath, e);
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }

        return filePath.toString();
    }

 /**   @Override
    public List<UserDto> findUsersByFirstName(String firstName) {
        List<User> users = userRepository.findAllByFirstNameContaining(firstName);
        return userMapper.modelsToDtos(users);
    }
 */
 @Override
 public List<UserDto> findAllUsersByFirstNameOrLastName(String keyword) {
     List<User> users = userRepository.findAllByFirstnameContainingOrLastnameContainingAndArchivedFalse(keyword, keyword);
     return users.stream()
             .map(userMapper::modelToDto)
             .collect(Collectors.toList());
 }

}









