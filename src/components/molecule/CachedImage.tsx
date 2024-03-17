import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ImageProps } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const defaultPath = RNFetchBlob.fs.dirs.CacheDir + '/' + 'vecto_task';

export const CachedImage: FC<ImageProps & { cacheKey: string; defaultFileName?: string }> = ({
  src,
  cacheKey,
  defaultFileName = '',
  ...rest
}) => {
  const fileName = useMemo(() => {
    if (defaultFileName) {
      return defaultPath + cacheKey + '/' + defaultFileName;
    }
    const pats = src?.split('/');
    return defaultPath + cacheKey + '/' + pats?.pop();
  }, [cacheKey, defaultFileName, src]);

  const [srcToShow, setSrcToShow] = useState<string | undefined>();

  const cache = useCallback(async () => {
    return RNFetchBlob.config({
      fileCache: true,
      path: fileName,
    })
      .fetch('GET', src!)
      .then(res => {
        return res.path();
      })
      .catch(err => {
        console.log({ ...err });
      });
  }, [fileName, src]);

  const checkIfExist = useCallback(async () => {
    if (fileName) {
      const isPath = await RNFetchBlob.fs.exists(fileName);
      return isPath;
    }
  }, [fileName]);

  useEffect(() => {
    (async () => {
      if (src) {
        const exist = await checkIfExist();

        if (exist) {
          setSrcToShow(`file://${fileName}`);
        } else {
          setSrcToShow(src);
          await RNFetchBlob.config({
            fileCache: true,
            path: fileName,
          })
            .fetch('GET', src)
            .catch(err => {
              console.warn(err);
            });
        }
      }
    })();
  }, [cache, checkIfExist, fileName, src]);

  return srcToShow ? <Image src={srcToShow} {...rest} /> : null;
};
