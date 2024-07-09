package winderp.authentication.user;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserServiceInterface {
    //   public UserDto saveUser(UserDto userDto);
    public UserDto saveUser(UserDto userDto, Integer companyIdentifier);

    List<UserDto> findAllUsers();

    UserDto findUserById(Integer id);

    void deleteUser(Integer id);

    UserDto updateUser(Integer id, UserDto updatedUserDto);

    public List<UserDto> findAllUsersByCompany(Integer companyIdentifier);
    public List<UserDto> findLeadersByCompany(Integer companyIdentifier);
    public List<UserDto> findEmployeesByCompany(Integer companyIdentifier);
    public void archiveUser(Integer id);
    public void unarchiveUser(Integer id);

    public void sendPasswordByEmail(String email, String generatedPassword);

   public void sendPassword(Integer userId);
    public UserDto saveAdmin(UserDto userDto);
  //  public void uploadProfileImage(MultipartFile file, Integer userId);
  public void uploadProfileImage(MultipartFile file, String fileName, Integer userId);
  //  public String saveImage(MultipartFile imageFile);
    public String saveImage(MultipartFile imageFile, String fileName);
   public List<UserDto> findAllUsersByFirstNameOrLastName(String keyword);
}