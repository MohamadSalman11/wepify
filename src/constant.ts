export const MESSAGE_UNSAVED_CHANGES = 'Changes you made may not be saved.';

export enum Path {
  Home = '/',
  Dashboard = '/dashboard',
  Editor = '/editor/sites/:siteId/pages/:pageId',
  NotFound = '*'
}

export enum DashboardPath {
  Recent = 'recent',
  Starred = 'starred'
}

export enum EditorPath {
  Elements = 'elements',
  Pages = 'pages',
  Layers = 'layers',
  Uploads = 'uploads',
  Preview = 'preview'
}

export enum LoadingMessages {
  DashboardCodeSplit = 'Preparing your management dashboard...',
  EditorCodeSplit = 'Preparing your site editor...',
  Dashboard = 'Loading your sites. Almost there...',
  SitePreview = 'Setting up your site preview...',
  Editor = 'Loading your editor content. Almost there...',
  Error = 'Something went wrong while loading the site.'
}

export enum StorageKey {
  Sites = 'sites',
  Images = 'images'
}

export enum Breakpoint {
  Desktop = 112.5, // 1800px
  laptop = 100, // 1600px
  TabLand = 75, // 1200px
  TabPort = 56.25, // 900px
  Phone = 37.5 // 600px
}

export const ToastMessages = {
  site: {
    duplicating: 'Duplicating site...',
    updating: 'Updating site...',
    deleting: 'Deleting site...',
    importing: 'Importing site...',
    downloading: 'Downloading site...',
    addedStar: 'Site added to starred',
    removedStar: 'Site removed from starred',
    updated: 'Site updated successfully',
    deleted: 'Site deleted successfully',
    duplicated: 'Site duplicated successfully',
    imported: 'Site imported successfully',
    importFailed: 'Failed to import the site',
    importInvalid: 'Invalid site JSON. Please upload a valid file',
    downloadFailed: 'Site could not be downloaded. Please try again',
    emptyName: 'Site name cannot be empty',
    emptyDescription: 'Site description cannot be empty',
    nameTooLong: 'Site name cannot exceed 12 characters',
    descriptionTooLong: 'Site description cannot exceed 20 characters'
  },
  page: {
    updated: 'Page updated successfully',
    linkCopied: 'Page link copied',
    linkCopyErr: 'Failed to copy page link',
    emptyName: 'Page name cannot be empty',
    cannotDeleteLast: 'This is the only page and cannot be deleted',
    switch: 'Switch to another page before deleting the current one',
    duplicateName: 'A page with this name already exists. Please choose a different name',
    saving: 'Cannot switch pages while the site is being saved'
  },
  image: {
    used: 'This image is used in one of the sites or pages and cannot be deleted'
  },
  network: {
    offline: 'You are currently offline. Some features may be unavailable',
    online: 'You are back online. All features are now available'
  },
  error: 'Something went wrong'
};
