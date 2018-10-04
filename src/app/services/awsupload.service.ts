import { Injectable } from '@angular/core';
//import * as AWS from 'aws-sdk/global';
//import * as S3 from 'aws-sdk/clients/s3';


@Injectable()
export class AwsuploadService {

  constructor() { }

  FOLDER = 'photos/';
  Bucket="msupplytestbucketdata";
 
  
 
  // uploadfile(file) {
 
  //   const bucket = new S3(
  //     {
  //       accessKeyId: 'AKIAJSASCB3OIBXTIILA',
  //       secretAccessKey: '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',
  //       region: 'ap-south-1'
  //     }
  //   );
 
  //   const params = {
  //     Bucket: this.Bucket,
  //     Key: this.FOLDER + file.name,
  //     Body: file
  //   };
 
  //   bucket.upload(params, function (err, data) {
  //     if (err) {
  //       console.log('There was an error uploading your file: ', err);
  //       return false;
  //     }
 
  //     console.log('Successfully uploaded file.', data);
  //     return true;
  //   });
  // }
  // getFiles(){
  //   const params = {
  //     Bucket: this.Bucket,
  //     Prefix: this.FOLDER
  //   };
  //   const bucket = new S3(
  //     {
  //       accessKeyId: 'AKIAJSASCB3OIBXTIILA',
  //       secretAccessKey: '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',
  //       region: 'ap-south-1'
  //     }
  //   );

  //   bucket.listObjects(params, function (err, data) {
  //     if (err) {
  //       console.log('There was an error getting your files: ' + err);
  //       return;
  //     }
 
  //     console.log('Successfully get files.', data);
 
  //     const fileDatas = data.Contents;
 
  //     fileDatas.forEach(function (file) {
  //       //fileUploads.push(new FileUpload(file.Key, 'https://s3.amazonaws.com/' + params.Bucket + '/' + file.Key));
  //     });
  //   });
  // }
  // getPreSignedUrl(url:string){
  //   const params = {
  //     Bucket: this.Bucket,
  //     Expires: 60 * 60,
  //     Key:url
  //   };
  //   const bucket = new S3(
  //     {
  //       accessKeyId: 'AKIAJSASCB3OIBXTIILA',
  //       secretAccessKey: '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',
  //       region: 'ap-south-1'
  //     }
  //   );

  //   bucket.getSignedUrl('getObject',params, function (err, data) {
  //     if (err) {
  //       console.log('There was an error getting your files: ' + err);
  //       return;
  //     }
 
  //     console.log('Successfully get files.', data);
 
      
  //   });

  // }


}
