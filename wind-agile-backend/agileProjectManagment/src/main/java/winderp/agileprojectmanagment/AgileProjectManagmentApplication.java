package winderp.agileprojectmanagment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AgileProjectManagmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgileProjectManagmentApplication.class, args);
    }

}
