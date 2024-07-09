package winderp.authentication.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final UserRepository userRepository;


    public CompanyController(CompanyService companyService,UserRepository userRepository) {
        this.companyService = companyService;
        this.userRepository = userRepository;

    }

    @PostMapping("/create")
    public CompanyDto saveCompany(
            @RequestBody CompanyDto companyDto
    ) {
        return this.companyService.saveCompany(companyDto);
    }

    @GetMapping("")
    public List<CompanyDto> findAllCompanies() {
        return companyService.findAllCompanies();
    }

    @GetMapping("/{company-id}")
    public CompanyDto findCompanyById(
            @PathVariable("company-id") Integer id
    ) {
        return companyService.findCompanyById(id);
    }

    @DeleteMapping("/{company-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCompany(
            @PathVariable("company-id") Integer id
    ) {
        companyService.deleteCompany(id);
    }

    @PutMapping("/{company-id}")
    public ResponseEntity<CompanyDto> updateCompany(
            @PathVariable("company-id") Integer id,
            @RequestBody CompanyDto updatedCompanyDto
    ) {
        CompanyDto updatedCompany = companyService.updateCompany(id, updatedCompanyDto);

        if (updatedCompany != null) {
            return new ResponseEntity<>(updatedCompany, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/{company-id}/archive")
    public ResponseEntity<String> archiveCompany(@PathVariable Integer companyId) {
        companyService.archiveCompany(companyId);
        return ResponseEntity.ok("L'utilisateur a été archivé avec succès.");
    }

    @PostMapping("/{company-id}/unarchive")
    public ResponseEntity<String> unarchiveCompany(@PathVariable Integer companyId) {
        companyService.unarchiveCompany(companyId);
        return ResponseEntity.ok("L'utilisateur a été désarchivé avec succès.");
    }
    @PostMapping("/{company-id}/validate")
    public ResponseEntity<String> validateCompany(@PathVariable("company-id") Integer id) {
        companyService.validateCompany(id);
        return new ResponseEntity<>("Company validated successfully", HttpStatus.OK);
    }

@PostMapping("/{company-id}/invalidate")
public ResponseEntity<String> invalidateCompany(@PathVariable("company-id") Integer id) {
    companyService.invalidateCompany(id);
    return new ResponseEntity<>("Company invalidated successfully", HttpStatus.OK);
}

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestParam("email") String email) {
        return companyService.resetPassword(email);
    }

/**
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("email") String email,
                                              @RequestParam("token") String token) {
        return companyService.verifyEmail(email, token);
    }
                                              */
@GetMapping("/verify-email")
public ResponseEntity<String> verifyEmail(@RequestParam("email") String email,
                                          @RequestParam("token") String token) {
    return companyService.verifyEmail(email, token);
}




/**
 @GetMapping("/{company-id}/send-password")
 public ResponseEntity<String> sendPassword(@PathVariable("company-id") Integer id) {
 companyService.sendPassword(id);
 return new ResponseEntity<>("Password sent successfully", HttpStatus.OK);
 }
 */
@GetMapping("/search")
public ResponseEntity<List<CompanyDto>> searchUsers(@RequestParam("query") String query) {
    List<CompanyDto> companys = companyService.findAllCompanyByCompanyName(query);
    return ResponseEntity.ok(companys);
}
@GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

}
