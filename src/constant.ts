export const TARGET_ORIGIN = '*';
export const TOAST_DURATION = 5000;

export enum Path {
  Home = '/',
  Dashboard = '/dashboard',
  Editor = '/editor/sites/:siteId/pages/:pageId'
}

export enum DashboardPath {
  Recent = 'recent',
  starred = 'starred'
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
  Site = 'site',
  Images = 'images'
}

export const ToastMessages = {
  site: {
    addedStar: 'Site added to starred',
    removedStar: 'Site removed from starred',
    updated: 'Site updated successfully',
    deleted: 'Site deleted successfully',
    imported: 'Site imported successfully',
    importFailed: 'Failed to import the site',
    importInvalid: 'Invalid site JSON. Please upload a valid file.'
  },
  page: {
    deleted: 'Site deleted successfully',
    renamed: 'Site name changed successfully',
    linkCopied: 'Page link copied',
    linkCopyErr: 'Failed to copy page link'
  }
} as const;
