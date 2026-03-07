const Campus360 = () => {
  const frame = document.getElementById('myIframe');
  if (frame) {
    (frame as any).muted = true;
  }

  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
      <iframe
        src="https://360.babafaridgroup.edu.in/"
        className="myiframe w-full h-full border-0 rounded-xl"
        allow="fullscreen"
      ></iframe>{' '}
    </div>
  );
};

export default Campus360;
