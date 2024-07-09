package winderp.authentication.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface CompanyServiceInterface {
    CompanyDto saveCompany(CompanyDto companyDto);

    List<CompanyDto> findAllCompanies();

    CompanyDto findCompanyById(Integer id);

    void deleteCompany(Integer id);

    CompanyDto updateCompany(Integer id, CompanyDto updatedCompanyDto);
    public void archiveCompany(Integer id);
    public void unarchiveCompany(Integer id);
    void validateCompany(Integer userId);
    public void sendPasswordByEmail(String email, String plainPassword);
     void invalidateCompany(Integer userId);
    public ResponseEntity<String> resetPassword(String email);
    public ResponseEntity<String> verifyEmail(@RequestParam("email") String email,
                                              @RequestParam("token") String token);
    public List<CompanyDto> findAllCompanyByCompanyName(String keyword);

}
