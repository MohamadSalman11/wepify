export const TARGET_ORIGIN = '*';
export const TOAST_DURATION = 5000;
export const TOAST_DELAY_MS = 1000;

export enum Path {
  Home = '/',
  Dashboard = '/dashboard',
  Editor = '/editor/sites/:siteId/pages/:pageId'
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
  Dashboard = 'Setting up your management dashboard...',
  SitePreview = 'Setting up your site preview...',
  Editor = 'Setting up your site editor...',
  Error = 'Something went wrong while loading the site.'
}

export enum StorageKey {
  Sites = 'sites',
  SitesMetaData = 'sitesMetadata',
  Site = 'site',
  Images = 'images'
}

export enum Breakpoint {
  Desktop = 112.5,
  TabLand = 75,
  TabPort = 56.25,
  Phone = 37.5
}

export const ToastMessages = {
  site: {
    generating: 'Generating site...',
    duplicating: 'Duplicating site...',
    updating: 'Updating site...',
    deleting: 'Deleting site...',
    importing: 'Importing site...',
    generated: 'Site generated! Download should appear shortly in your browser.',
    addedStar: 'Site added to starred.',
    removedStar: 'Site removed from starred.',
    updated: 'Site updated successfully.',
    deleted: 'Site deleted successfully.',
    duplicated: 'Site duplicated successfully.',
    imported: 'Site imported successfully.',
    importFailed: 'Failed to import the site.',
    importInvalid: 'Invalid site JSON. Please upload a valid file.',
    downloadFailed: 'Site could not be downloaded. Please try again.',
    emptyName: 'Site name cannot be empty.',
    emptyDescription: 'Site description cannot be empty.',
    nameTooLong: 'Site name cannot exceed 12 characters.',
    descriptionTooLong: 'Site description cannot exceed 20 characters.'
  },
  page: {
    renamed: 'Page name changed successfully.',
    deleted: 'Page deleted successfully.',
    linkCopied: 'Page link copied.',
    linkCopyErr: 'Failed to copy page link.',
    emptyName: 'Page name cannot be empty.',
    duplicateName: 'A page with this name already exists. Please choose a different name.'
  },
  network: {
    offline: 'You are currently offline. Some features may be unavailable.',
    online: 'You are back online. All features are now available.'
  },
  error: 'Something went wrong.'
} as const;
