---
title: Uploading a statically hosted blog to AWS S3
date: 2017-10-31 22:12:35
tags: [S3, AWS, C#]
---

This blog runs as a static site, generated using [Hexo](https://hexo.io/) and hosted on [Amazon's S3 storage service](https://aws.amazon.com/s3/). One annoying issue I'd come across when publishing my site was that the *content-type* metadata of the uploaded files didn't match what I was expecting. When I ran *hexo server* locally to check what my blog posts would look like, all was well, but as soon as I'd uploaded the content to my bucket in S3, the website wouldn't work correctly. CSS wouldn't be applied as expected, and links to blog posts would be treated by the browser as downloadable content instead of HTML pages.

In order to resolve this issue, I decided to create a simple app using the AWS C# S3 SDK.
<!-- more -->

A bit of digging uncovered [this blog post](http://markgibson.info/2013/09/css-and-amazon-s3.html), which describes the issue with regards CSS content. The files in the S3 bucket didn't have the correct *content-type* metadata set, resulting in the files being handled incorrecly by the browser.

Once a file had been uploaded to my bucket, and the content-type metadata configured to the correct [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types), uploading an updated version of the file individually would retain the metadata, but doing a bulk upload of the entire folder would cause the *content-type* to be reset back to the default *binary/octet-stream*

<img src="/images/S3ObjectMetadata.png" style="width: 375px; height: 378px" alt="S3 object metadata"/>

Obviously this would quickly become a pain to manage manually, so instead I wrote a small utility to do the bulk upload to my S3 bucket, using the AWS SDK for .Net. The program simply takes a bucket name and a source directory as command line arguments and copies the files and folders into the corresponding structure in the specified bucket. Content type metadata is assigned to each object as it is inserted into the S3 bucket, selecting a MIME type based on the file's extension. This can be obtained via the GetMimeMapping method of the System.Web.MimeMapping class.

As the folder structure in an S3 bucket effectively mirrors the folder hierarchy from the source directory, it's necessary to exchange the backslashes from the source paths with forward slashes to ensure the folders in the bucket correspond to the source. It's also necessary to remove the root directory path for each uploaded file path, given that we're copying from the root of the source directory to the root of the S3 bucket.

Now I can simply point the app at the directory generated as a result of running *hexo generate* and the folder will be copied up to my S3 bucket, preserving the not only the directory hierarchy but also the content-type of each asset.  

The source for this utility can be downloaded from [my Github repository](https://github.com/JamieGeddes/S3Uploader). The application assumes you have configured suitable [IAM](https://aws.amazon.com/iam/) access credentials locally first, as described [here](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).