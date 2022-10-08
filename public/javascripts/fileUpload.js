const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--film-poster-width-large') != null && rootStyles.getPropertyValue('--film-poster-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--film-poster-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--film-poster-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })
  
  FilePond.parse(document.body)
}
