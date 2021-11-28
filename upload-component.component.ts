import { ApiserviceService } from './../Api/apiservice.service';
import { HttpEventType, HttpResponse, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadserviceService } from '../uploadservice.service';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.css']
})
export class UploadComponentComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
   File:any=[]

  fileInfos?: Observable<any>;
  ngOnInit(): void {
    
   this.uploadService.getFiles().subscribe(data=>{
   
    this.File=data

    })
  }
  constructor(private uploadService:UploadserviceService) { }
  

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
}
