package winderp.agileprojectmanagment.comment;

import java.util.Date;

public record ReturnedCommentDto(Long id,
                                 String text,
                                 Date date,
                                 Integer userId) {
}
