package winderp.authentication.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class ProfileImageController {

    private final UserService userService;
    private final UserRepository userRepository;
    @Autowired
    public ProfileImageController(UserService userService,UserRepository userRepository) {
        this.userService = userService;
        this.userRepository=userRepository;
    }

@PostMapping(value = "/users/uploadProfileImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file, @RequestParam("userId") Integer userId) {
    try {
        String fileName = file.getOriginalFilename();
        userService.uploadProfileImage(file, fileName, userId);
        return ResponseEntity.ok().body("{\"message\": \"Profile image uploaded successfully\"}");
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to upload profile image\"}");
    }
}


    @GetMapping("/users/{userId}/profileImageUrl")
    public ResponseEntity<String> getProfileImageUrl(@PathVariable Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String profileImageUrl = user.getProfileImageUrl();

        String publicImageUrl = "http://localhost:8060/images/" + profileImageUrl;

        return ResponseEntity.ok(publicImageUrl);
    }






}