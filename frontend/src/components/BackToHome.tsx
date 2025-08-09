import React from 'react';

interface BackToHomeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showOnPages?: string[];
  hideOnPages?: string[];
}

const BackToHome: React.FC<BackToHomeProps> = () => {
  // 组件已禁用，不显示任何内容
  return null;
};

export default BackToHome;
