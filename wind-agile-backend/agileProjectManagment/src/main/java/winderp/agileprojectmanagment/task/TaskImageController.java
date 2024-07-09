package winderp.agileprojectmanagment.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class TaskImageController {

    private final TaskService taskService;

    @Autowired
    public TaskImageController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping(value = "/tasks/{taskId}/uploadTaskImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadTaskImage(@PathVariable Long taskId, @RequestParam("files") List<MultipartFile> files) {
        try {
            taskService.uploadTaskImages(taskId, files);
            return ResponseEntity.ok().body("{\"message\": \"Task images uploaded successfully\"}");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Failed to upload task images\"}");
        }
    }

    @GetMapping("/tasks/{taskId}/taskImageUrls")
    public ResponseEntity<List<String>> getTaskImageUrls(@PathVariable Long taskId) {
        List<String> taskImageUrls = taskService.getTaskImageUrls(taskId);
        List<String> publicImageUrls = new ArrayList<>();

        String baseUrl = "http://localhost:8050/tasks/images/";

        for (String imageName : taskImageUrls) {
            publicImageUrls.add(baseUrl + imageName);
        }

        return ResponseEntity.ok(publicImageUrls);
    }




}
