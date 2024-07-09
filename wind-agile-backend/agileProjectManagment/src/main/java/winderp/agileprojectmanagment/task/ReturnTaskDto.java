package winderp.agileprojectmanagment.task;

import java.util.Date;

public record ReturnTaskDto(
        Long id,
        String name,
        String description,
        String state,
        Date startDate,
        Integer estimation,
        String priority,
        Integer userId,
        Boolean isDeleted


        ) {
}
