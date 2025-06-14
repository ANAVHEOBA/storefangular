import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyVideosApiService } from '../../../../lib/myvideo/api';
import { VideoDetails } from '../../../../lib/myvideo/types';
import { VideoCardComponent } from '../../video/video-card/video-card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  template: `
    <div class="my-videos-gallery">
      <h2>My Videos</h2>
      @if (isLoading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your videos...</p>
        </div>
      } @else if (error) {
        <div class="error-state">
          <p>{{ error }}</p>
        </div>
      } @else if (videos.length > 0) {
        <div class="videos-grid">
          @for (video of videos; track video._id) {
            <app-video-card [video]="mapVideo(video)"></app-video-card>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>You haven't uploaded any videos yet.</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./my-videos.scss']
})
export class MyVideosComponent implements OnInit {
  videos: VideoDetails[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private myVideosApi: MyVideosApiService) {}

  ngOnInit() {
    this.loadMyVideos();
  }

  loadMyVideos() {
    this.isLoading = true;
    this.error = null;
    this.myVideosApi.getMyVideos().subscribe({
      next: (response) => {
        if (response.success) {
          this.videos = response.videos;
        } else {
          this.error = 'Failed to load videos.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching your videos.';
        this.isLoading = false;
      }
    });
  }

  mapVideo(videoDetails: VideoDetails) {
    const baseUrl = environment.apiUrl.replace('/api', '');
    return {
      id: videoDetails._id,
      title: videoDetails.title,
      thumbnail: `${baseUrl}/${videoDetails.files.thumbnail.path}`,
      duration: videoDetails.metadata.duration,
      views: videoDetails.viewCount,
      createdAt: new Date(videoDetails.createdAt),
      cdnUrl: videoDetails.files.original.cdnUrl,
      creator: {
        id: videoDetails.userId,
        username: 'You'
      }
    };
  }
} 