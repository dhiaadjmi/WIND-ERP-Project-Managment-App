import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageScreenDialogComponent } from '../image-screen-dialog/image-screen-dialog.component';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent {
  taskData: any;
  userData: any;
  timelineData: any[];
  selectedIndex: number | null = null;
  isHovered: boolean = false;
  newCommentText: string = '';
  showAllComments: boolean = false;
  numCommentsToShow: number = 3;
  currentImageIndex: number = 0;
  isImageExpanded: boolean = false;
  userId: number;

  @ViewChild('dialogContent', { static: true }) dialogContent!: ElementRef;
  isScrollable: boolean = false;
  taskComments: any[];
  userRole: any;
  taskStateTranslations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    ON_HOLD: 'En attente',
    CANCELED: 'Annulé'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { taskId: number },
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog,
    private commentService: CommentService,
    private authService: AuthenticationService,
    private companyService: CompanyService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TaskDetailsComponent>
  ) {
    this.loadTaskDetails(data.taskId);
    this.userId = this.authService.getUserId();
    console.log("User ID de company", this.userId);
  }

  ngOnInit(): void {
    this.checkScrollable();
    this.loadComments(this.data.taskId);
    this.userRole = this.authService.getRole();
    console.log("Roles: ", this.userRole);
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.taskData.imageUrls.length - 1) {
      this.currentImageIndex++;
    }
  }

  toggleImageSize() {
    console.log('toggleImageSize() called');
    this.isImageExpanded = !this.isImageExpanded;
  }

  loadTaskDetails(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe(
      (response) => {
        this.taskData = response;
        console.log('Task Data:', this.taskData);
        this.loadUserData(this.taskData.userId);
        this.taskComments = this.taskData.comments;
        this.taskComments.forEach(comment => {
          this.loadCommentUserData(comment);
        });
      },
      (error) => {
        console.error('Error fetching task details:', error);
      }
    );
  }

  loadUserData(userId: number): void {
    this.userService.getUserDetails(userId).subscribe(
      (userData) => {
        this.userData = userData;
        if (userData.profileImageUrl) {
          this.userData.profileImageUrl = this.generateProfileImageUrl(userData.profileImageUrl);
        }
        console.log('User Data:', this.userData);
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  generateProfileImageUrl(imageUrl: string): string {
    return 'http://localhost:8060/images/' + imageUrl;
  }

  generateImageUrl(imageUrl: string): string {
    return 'http://localhost:8050/tasks/images/' + imageUrl;
  }

  checkScrollable(): void {
    const maxHeight = 600;
    if (this.dialogContent.nativeElement.scrollHeight > maxHeight) {
      this.isScrollable = true;
    }
  }

  openImageDialog(taskId: any): void {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '600px',
      data: { taskId: taskId }
    });
    dialogRef.componentInstance.imagesUploaded.subscribe(() => {
      this.loadTaskDetails(taskId);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  loadComments(taskId: number): void {
    this.commentService.findCommentsByTask(taskId).subscribe(
      (comments) => {
        this.taskComments = comments;
        this.taskComments.forEach(comment => {
          this.loadCommentUserData(comment);
        });
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  loadCommentUserData(comment: any): void {
    this.userService.getUserDetails(comment.userId).subscribe(
      (userData) => {
        if (!userData.firstname && !userData.lastname) {
          this.companyService.getCompanyDetails(comment.userId).subscribe(
            (companyDetails) => {
              const companyName = companyDetails.companyName;
              comment.userData = { firstname: companyName, profileImageUrl: this.generateProfileImageUrl(userData.profileImageUrl) };
            },
            (error) => {
              console.error('Error fetching company details:', error);
            }
          );
        } else {
          comment.userData = { firstname: userData.firstname, lastname: userData.lastname, profileImageUrl: this.generateProfileImageUrl(userData.profileImageUrl) };
        }
      },
      (error) => {
        console.error('Error fetching user details for comment:', error);
      }
    );
  }

  addComment(): void {
    const userIdForComment = this.authService.getUserId();
    const commentData = {
        text: this.newCommentText,
        userId: userIdForComment,
        taskId: this.data.taskId,
        date: new Date().toISOString()
    };

    this.commentService.saveComment(commentData, this.data.taskId, userIdForComment).subscribe(
        (response) => {
            this.userService.getUserDetails(userIdForComment).subscribe(
                (userData) => {
                    if (!userData.firstname && !userData.lastname) {
                        this.companyService.getCompanyDetails(userIdForComment).subscribe(
                            (companyDetails) => {
                                const companyName = companyDetails.companyName;
                                response.userData = { firstname: companyName, profileImageUrl: this.generateProfileImageUrl(userData.profileImageUrl) };
                                this.taskData.comments.unshift(response);

                                this.toastr.success('Commentaire ajouté avec succès!', 'Succès', {
                                    timeOut: 1500,
                                    positionClass: 'toast-top-right',
                                    progressBar: true,
                                });
                                this.newCommentText = '';
                            },
                            (error) => {
                                console.error('Erreur lors du chargement des détails de l\'entreprise :', error);
                                this.toastr.error('Une erreur s\'est produite. Veuillez réessayer.', 'Erreur', {
                                    timeOut: 3000,
                                    positionClass: 'toast-top-right',
                                    progressBar: true,
                                });
                            }
                        );
                    } else {
                        response.userData = {
                            firstname: userData.firstname,
                            lastname: userData.lastname,
                            profileImageUrl: this.generateProfileImageUrl(userData.profileImageUrl)
                        };
                        this.taskData.comments.unshift(response);

                        this.toastr.success('Commentaire ajouté avec succès!', 'Succès', {
                            timeOut: 1500,
                            positionClass: 'toast-top-right',
                            progressBar: true,
                        });
                        this.newCommentText = '';
                    }
                },
                (error) => {
                    console.error('Erreur lors du chargement des détails utilisateur :', error);
                    this.toastr.error('Une erreur s\'est produite. Veuillez réessayer.', 'Erreur', {
                        timeOut: 3000,
                        positionClass: 'toast-top-right',
                        progressBar: true,
                    });
                }
            );
        },
        (error) => {
            console.error('Erreur lors de l\'ajout du commentaire :', error);
            this.toastr.error('Une erreur s\'est produite. Veuillez réessayer.', 'Erreur', {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                progressBar: true,
            });
        }
    );
}


  toggleCommentsDisplay(): void {
    this.showAllComments = !this.showAllComments;
  }

  openImageScreenDialog(imageUrl: string): void {
    const dialogRef = this.dialog.open(ImageScreenDialogComponent, {
      data: { imageUrl }
    });
  }

  getElapsedTime(commentDate: string): string {
    const now = new Date();
    const commentTime = new Date(commentDate);

    const diff = now.getTime() - commentTime.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));

    if (diffMinutes < 1) {
      return 'il y a quelques secondes';
    } else if (diffMinutes < 60) {
      return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
      if (diffDays === 1) {
        return 'Hier';
      } else {
        const formattedDate = this.datePipe.transform(commentTime, 'shortDate');
        return formattedDate ? formattedDate : 'Date invalide';
      }
    }
  }

  deleteComment(commentId: number, index: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      confirmButtonColor: '#00095E',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#facc15'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe(
          () => {
            this.taskComments.splice(index, 1);
            this.toastr.success('Commentaire supprimé avec succès!', 'Succès', {
              timeOut: 1500,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          },
          (error) => {
            console.error('Erreur lors de la suppression du commentaire :', error);
            this.toastr.error('Une erreur s\'est produite. Veuillez réessayer.', 'Erreur', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          }
        );
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
