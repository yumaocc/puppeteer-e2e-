/**
 * 设计思路：将对应的dom节点全部存在ref里面(不用每次都去获取节点，可以提升性能)，然后滚动的时候在ref里去遍历每个节点距离顶部的距离，小于等于offsetTop更新activeSection
 * 点击的时候同理，只需要移动到固定节点，然后出发scroll去跟新activeSection
 */
import { Button, Timeline } from 'antd';
import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import './index.less';

interface Props {
  /**距离窗口顶部达到指定偏移量后触发 */
  offsetTop?: number;
  options: { title: string; id: string }[];
  /**导航器点一点之间的距离 */
  height?: number;
  /**容器类名，使用umi可以不传,注意是滚动容器的类名，不是父容器的类名 */
  container?: string;
  /**节流时间 */
  wait?: number;
}

function AnchorNavigation(props: Props) {
  const {
    offsetTop = 100,
    height = 50,
    container = 'workbench-container',
    wait = 300,
    options,
  } = props;

  //激活的选项
  const [activeSection, setActiveSection] = useState<string | null>(null);

  //用于存入所有节点ref
  const sectionsRef = useRef<HTMLDivElement[] | null>([]);

  //获取当前激活选项，页面滚动的时候，遍历所有节点，然后判断谁距离顶部的距离<=offsetTop,
  const getCurrentSection = () => {
    let currentSection = null;

    sectionsRef.current?.forEach((section) => {
      const sectionRect = section?.getBoundingClientRect();

      if (sectionRect.top <= offsetTop) {
        currentSection = section;
      }
    });

    return (currentSection as any)?.id || null;
  };

  const handleScroll = () => {
    const currentSection = getCurrentSection();
    if (currentSection) {
      setActiveSection(currentSection);
    }
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('#' + container);

    scrollContainer?.addEventListener('scroll', throttle(handleScroll, wait));

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    sectionsRef.current = sectionsRef?.current?.slice(0, 0) as HTMLDivElement[];

    options?.forEach((item) => {
      const node = document.querySelector('#' + item.id) as HTMLDivElement;

      sectionsRef.current?.push(node);
    });

    handleScroll();
  }, []);

  //滚动到指定的选项，使用api进行滚动的时候也会触发handleScroll函数，所以这里不需要去调用setActiveSection，刚好可以避免末尾元素高度不够的情况
  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef?.current?.find(
      (section) => section.id === sectionId,
    );
    if (section) {
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLinkClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <div className="anchor-wrapper">
      <Timeline>
        {options?.map((item) => (
          <Timeline.Item
            style={{ height: height + 'px' }}
            key={item.id}
            dot={
              <div
                className={activeSection === item.id ? 'dot active' : 'dot'}
              />
            }
          >
            <Button
              style={{ padding: 0, margin: 0, height: '100%' }}
              type={activeSection === item.id ? 'link' : 'text'}
              onClick={() => {
                handleLinkClick(item.id);
              }}
            >
              {item.title}
            </Button>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}

export default AnchorNavigation;
