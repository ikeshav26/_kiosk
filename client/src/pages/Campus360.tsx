const Campus360 = () => {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-md overflow-hidden relative">
      <iframe
        src="/virtual-tour/index.html"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Campus Virtual Tour"
      />
    </div>
  );
};

export default Campus360;
