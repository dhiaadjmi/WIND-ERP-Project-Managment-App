package winderp.authentication.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
/**
    @PostMapping("/create")
    public UserDto saveUser(
            @RequestBody UserDto userDto
    ) {
        return this.userService.saveUser(userDto);
    }
*/
@PostMapping("/create")
public ResponseEntity<UserDto> saveUser(@RequestBody UserDto userDto, @RequestParam Integer companyIdentifier) {
    UserDto savedUser = userService.saveUser(userDto, companyIdentifier);
    return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
}
    @GetMapping("")
    public List<UserDto> findAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/{user-id}")
    public UserDto findUserById(
            @PathVariable("user-id") Integer id
    ) {
        return userService.findUserById(id);
    }

    @DeleteMapping("/{user-id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUser(
            @PathVariable("user-id") Integer id
    ) {
        userService.deleteUser(id);
    }

    @PutMapping("/{user-id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable("user-id") Integer id,
            @RequestBody UserDto updatedUserDto
    ) {
        UserDto updatedUser = userService.updateUser(id, updatedUserDto);

        if (updatedUser != null) {
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/{userId}/addTeam/{teamId}")
    public ResponseEntity<String> addTeamToUser(@PathVariable Integer userId, @PathVariable Long teamId) {
        UserDto userDto = userService.findUserById(userId);

        if (userDto != null) {
            userService.addTeamToUser(userDto, teamId);
            return ResponseEntity.ok("Équipe ajoutée à l'utilisateur avec succès.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé avec l'ID : " + userId);
        }
    }
    @GetMapping("/usersbycompany")
    public List<UserDto> getAllUsersByCompany(@RequestParam Integer companyIdentifier) {
        return userService.findAllUsersByCompany(companyIdentifier);
    }
    @GetMapping("/leaders")
    public List<UserDto> getLeadersByCompany(@RequestParam Integer companyIdentifier) {
        return userService.findLeadersByCompany(companyIdentifier);
    }
    @GetMapping("/employees")
    public List<UserDto> getEmployeesByCompany(@RequestParam Integer companyIdentifier) {
        return userService.findEmployeesByCompany(companyIdentifier);
    }



    @PostMapping("/{userId}/archive")
    public ResponseEntity<String> archiveUser(@PathVariable Integer userId) {
        userService.archiveUser(userId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body("{\"message\": \"L'utilisateur a été archivé avec succès.\"}");
    }

    @PostMapping("/{userId}/unarchive")
    public ResponseEntity<String> unarchiveUser(@PathVariable Integer userId) {
        userService.unarchiveUser(userId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body("{\"message\": \"L'utilisateur a été unarchivé avec succès.\"}");
    }


    @PostMapping("/createadmin")
    public ResponseEntity<UserDto> saveAdmin(@RequestBody UserDto userDto) {
        UserDto savedUser = userService.saveAdmin(userDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

 /**   @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsersByFirstName(@RequestParam("firstName") String firstName) {
        List<UserDto> users = userService.findUsersByFirstName(firstName);
        return ResponseEntity.ok(users);
    }
*/
 @GetMapping("/search")
 public ResponseEntity<List<UserDto>> searchUsers(@RequestParam("query") String query) {
     List<UserDto> users = userService.findAllUsersByFirstNameOrLastName(query);
     return ResponseEntity.ok(users);
 }
}
