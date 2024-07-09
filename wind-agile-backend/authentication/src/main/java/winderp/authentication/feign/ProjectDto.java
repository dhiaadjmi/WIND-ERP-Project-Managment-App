package winderp.authentication.feign;

import java.time.LocalDateTime;

public record ProjectDto(
        Long id,
        String nom,
        String description,
        String state,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Long teamId
) {
}
