import * as Tooltip from "@radix-ui/react-tooltip";

export const TooltipComponent = ({
  children,
  content,
  asChild = false,
  usePortal = true,
  ...rest
}) => {
  if (usePortal) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="select-none rounded-md bg-gray-800 px-3 py-1.5 text-xs leading-tight text-white shadow-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            {...rest}
          >
            {content}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
      <Tooltip.Content
        className="select-none rounded-md bg-gray-800 px-3 py-1.5 text-xs leading-tight text-white shadow-lg will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
        {...rest}
      >
        {content}
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
