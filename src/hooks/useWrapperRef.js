import { useEffect, useState, useRef } from 'react';

const useWrapperRef = heightRest => {
  const [height, setHeight] = useState(0);
  const wrapperRef = useRef();

  useEffect(() => {
    if (wrapperRef.current) {
      setHeight(wrapperRef.current.clientHeight - heightRest);
    }
  }, [heightRest, wrapperRef]);

  return { height, wrapperRef };
};

export default useWrapperRef;
