import React from 'react';
import { useEventEmitter } from 'ahooks';

function MyComponent() {
  const emitter = useEventEmitter();

  const handleClick = () => {
    // 触发自定义事件
    emitter.emit('myEvent', 'Hello, World!');
  };

  // 订阅自定义事件
  React.useEffect(() => {
    const handleEvent = (data) => {
      console.log('Event received:', data);
    };
    emitter.on('myEvent', handleEvent);

    return () => {
      // 在组件卸载时取消订阅
      emitter.off('myEvent', handleEvent);
    };
  }, [emitter]);

  return (
    <button onClick={handleClick}>Click Me</button>
  );
}
