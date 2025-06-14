import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VideoGalleryComponent } from '../video/video-gallery/video-gallery';
import { ProfileApiService } from '../../../lib/profile/api';
import { ProfileUser } from '../../../lib/profile/types';
import { SidebarService } from '../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, VideoGalleryComponent],
  template: `
    <div class="dashboard-container" [class.sidebar-open]="isSidebarOpen">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="user-profile">
          <div class="avatar">{{ getUserInitial() }}</div>
          <div class="user-info">
            <div class="username">{{ user?.username || 'User' }}</div>
            <div class="email">{{ user?.email || '' }}</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/" class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a routerLink="/profile" class="nav-item" routerLinkActive="active">
            <i class="fas fa-user"></i>
            <span>Your Channel</span>
          </a>
          <a routerLink="/settings" class="nav-item" routerLinkActive="active">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </a>
          <div class="nav-divider"></div>
          <button class="nav-item sign-out" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      <!-- Overlay for closing sidebar on mobile -->
      <div class="sidebar-overlay" *ngIf="isSidebarOpen" (click)="closeSidebar()"></div>

      <!-- Main Content -->
      <main class="main-content">
        <app-video-gallery></app-video-gallery>
      </main>
    </div>
  `,
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: ProfileUser | null = null;
  isSidebarOpen = false;
  private sidebarSubscription: Subscription;

  constructor(
    private profileApi: ProfileApiService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
    this.loadProfile();
    this.sidebarSubscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.isSidebarOpen = isOpen
    );
  }

  ngOnInit() {
    // Component initialization logic
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  getUserInitial(): string {
    return this.user?.username?.charAt(0)?.toUpperCase() || 'U';
  }

  closeSidebar() {
    this.sidebarService.setSidebarOpen(false);
  }

  private loadProfile() {
    this.profileApi.getProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.user;
        }
      }
    });
  }

  logout() {
    // Add logout functionality
    this.router.navigate(['/']);
  }
} 