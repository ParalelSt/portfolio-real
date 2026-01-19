interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={`flex flex-col gap-5 p-5 w-full h-full border-2 border-accent rounded-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
