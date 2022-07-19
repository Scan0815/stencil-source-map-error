
const BYTES_PER_CHUNK = 1024 * 1024 * 4;
let LoadedArray = [];
let Total = 0;
let intervalTime = 10;
let throttleTime = 5000;
const UploadChunk = (url, credentials, file,
                     readyStateChanged?: () => void,
                     responseHandler?: (response: any) => void,
                     progressHandler?: (loaded: number, total: number) => void,
                     errorHandler?: (error: any) => void) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('x-auth-resource', credentials.resource);
  xhr.setRequestHeader('x-auth-token', credentials.token);
  xhr.withCredentials = true;
  xhr.onreadystatechange = () => {
    readyStateChanged();
    if (xhr.readyState == 4) {
      let responseJson;
      try {
        responseJson = JSON.parse(xhr.responseText)
      } catch (e) {
        responseJson = null;
      }
      if (xhr.status === 201 || xhr.status === 200) {
        responseHandler(responseJson);
      } else  if (xhr.status === 400 || xhr.status === 401) {
        errorHandler(responseJson);
      } else {
        errorHandler({systemCode: 'resume'});
      }
    }
  };

  if (xhr.upload) {
    xhr.upload.onprogress = (_e) => {
      if (progressHandler) {
        progressHandler(_e.loaded, _e.total);
      }
    };
  }

  xhr.onabort = () => {
    errorHandler({systemCode: 'abort'});
  };

  xhr.send(file);

}


export async function ProcessNextChunk(url,
                                       credentials,
                                       chunkQueue,
                                       transfers,
                                       responseHandler?: (response: any) => void,
                                       progressHandler?: (loaded: number, total: number) => void,
                                       errorHandler?: (error: any) => void,
) {
  const chunkQueueItem = chunkQueue.pop();
  const transferFile = transfers[chunkQueueItem.transferKey];
  const chunk = transferFile.file.slice(chunkQueueItem.start, chunkQueueItem.end);
  const isFile = transferFile.hasOwnProperty('name');
  const formData: FormData = new FormData();
  formData.append('chunk', chunk, (isFile) ? (transferFile.file['name'] + "_" + chunkQueueItem.id) : "ghjgjhjghjgh");
  formData.append('chunkId', chunkQueueItem.id.toString());
  formData.append('chunkSizeStart', chunkQueueItem.start.toString());
  formData.append('chunkSizeEnd', chunkQueueItem.end.toString());
  formData.append('chunkCount', chunkQueueItem.chunkCount.toString());
  formData.append('fileSize', chunkQueueItem.size.toString());
  formData.append('fileType', transferFile.file.type.toString());
  formData.append('guid', transferFile.guid);
  formData.append('transferId', transferFile.transferId);

  if (transferFile.exIf) {
    formData.append('exIf', JSON.stringify(transferFile.exIf));
  }

  UploadChunk(url, credentials, formData, () => {
    }, (response) => {
      responseHandler(response);
    }, (loaded, total) => {
      LoadedArray[chunkQueueItem.id] = (loaded / total);
      progressHandler(LoadedArray.reduce((partialSum, a) => partialSum + a, 0), Total);
    }
    , (error) => {
      if (error?.systemCode == 'resume') {
        chunkQueue.push(chunkQueueItem);
      }else{
        timer.stop();
      }
      errorHandler(error);
    });
}


export const timer = {
  timers: {id:null,func:()=>{}},
  inc:0,
  start:(cb,gap) => {
    timer.timers = {
      id: setInterval(cb,gap),
      func : cb
    };
    return timer.timers['id'];
  },
  stop:() => {
    if(!timer.timers['id']) return;
    clearInterval(timer.timers['id']);
    delete timer.timers['id'];
  },
  change:(newGap) => {
    if( !timer.timers['id']) return;
    clearInterval(timer.timers['id']);
    timer.timers['id'] = setInterval(timer.timers['func'],newGap);
  }
};

export const UploadWorker = async (url,
                                   credentials,
                                   transfers,
                                   responseHandler?: (response: any) => void,
                                   progressHandler?: (loaded: number, total: number) => void,
                                   errorHandler?: (error: any) => void) => {

  Total = 0;
  LoadedArray = [];
  let maxUploads = 5;
  let activeUploads = 0;
  let chunkCountOverAll = 0;
  const chunkQueue = [];

  return new Promise(_resolve => {
    transfers.forEach((transfer, transferKey) => {
      const blob = transfer.file;
      const SIZE = blob.size;
      const chunkCount = Math.ceil(SIZE / BYTES_PER_CHUNK);
      for (let index = 0; index < chunkCount; index++) {
        chunkQueue.push({
          id: chunkCountOverAll,
          start: index * BYTES_PER_CHUNK,
          end: Math.min(index * BYTES_PER_CHUNK + BYTES_PER_CHUNK, SIZE),
          size: SIZE,
          transferKey,
          chunkCount
        });
        ++chunkCountOverAll;
      }
    });

    Total = chunkCountOverAll;

    timer.start(function () {
      if (activeUploads <= maxUploads && chunkQueue.length > 0) {
        ++activeUploads;
        ProcessNextChunk(
          url,
          credentials,
          chunkQueue.reverse(),
          transfers,
          (response) => {
            timer.change(intervalTime)
            --activeUploads;
            if (response.complete) {
              _resolve(response);
              timer.stop();
            }
            responseHandler(response)
          },
          progressHandler,
          (error) => {
            if(error.systemCode === "resume") {
              --activeUploads;
              timer.change(throttleTime);
            }
            errorHandler(error)
          });
      }
    },intervalTime);
  });
};
