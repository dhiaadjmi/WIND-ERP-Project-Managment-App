package winderp.agileprojectmanagment.sprint;

import java.util.Date;

public record ReturnedSprintDto(Long id,
                                String objectif,
                                Date startDate,
                                Date endDate,
                                String state,
                                int priority,
                                Boolean validate,
                                Boolean defaultSprint,
                                Boolean isDeleted

) {
}
