export default function decorate(block) {
  const rows = [...block.children];
  const hasVideo = rows.length > 1;

  if (hasVideo) {
    const videoRow = rows[rows.length - 1];
    const videoUrl = videoRow.textContent.trim();
    videoRow.remove();

    if (videoUrl) {
      const video = document.createElement('video');
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.classList.add('hero-video-bg');

      const source = document.createElement('source');
      source.setAttribute('src', videoUrl);
      source.setAttribute('type', 'video/mp4');
      video.append(source);

      block.prepend(video);
    }
  }

  const contentRow = block.querySelector(':scope > div');
  if (contentRow) {
    contentRow.classList.add('hero-video-content');
  }
}
