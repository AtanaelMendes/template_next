import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/assets/utils';

const AccordionContext = createContext();

const AnimatedAccordion = ({ children, className }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <AccordionContext.Provider value={{ openIndex, toggleIndex }}>
      <div className={cn('border border-gray-200 rounded-md w-full', className)}>
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child) ? React.cloneElement(child, { index }) : child
        )}
      </div>
    </AccordionContext.Provider>
  );
};

const AnimatedAccordionItem = ({ index, children }) => {
  const { openIndex, toggleIndex } = useContext(AccordionContext);
  const isOpen = openIndex === index;

  return (
    <div className='border-b border-gray-200'>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { isOpen, index, toggleIndex }) : child
      )}
    </div>
  );
};

const AnimatedAccordionHeader = ({ children, isOpen, index, toggleIndex, className }) => (
	<button
		className={cn(
			'flex w-full items-center justify-between gap-2 text-left font-medium first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 p-3 text-base',
			isOpen ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray',
			className
		)}
		onClick={() => toggleIndex(index)}
	>
		<span
			className={cn(
				isOpen ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
			)}
		>
			{children}
		</span>
		<motion.span
			initial={{ rotate: 0 }}
			animate={{ rotate: isOpen ? 180 : 0 }}
			transition={{ duration: 0.2 }}
		>
			<FontAwesomeIcon icon={faChevronDown} height={15} width={15} color='black' />
		</motion.span>
	</button>
);

const AnimatedAccordionContent = ({ children, isOpen }) => (
	<AnimatePresence initial={false}>
		{isOpen && (
			<motion.div
				initial='collapsed'
				animate='open'
				exit='collapsed'
				variants={{
					open: { height: 'auto', opacity: 1 },
					collapsed: { height: 0, opacity: 0 },
				}}
				transition={{ duration: 0.3 }}
				className='overflow-hidden'
			>
				<div className='p-4'>{children}</div>
			</motion.div>
		)}
	</AnimatePresence>
);

export {
	AnimatedAccordion,
	AnimatedAccordionItem,
	AnimatedAccordionHeader,
	AnimatedAccordionContent,
};
