const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="spinner"></div>
      <p className="mt-4 text-text-secondary">{text}</p>
    </div>
  );
};

export default Loading;
