// DE-MAJ Architecture - Project Categories
// Categories exactly as specified in the PROJECT SECTION wireframe

export const categories = [
  {
    id: '01',
    title: 'MASTER PLANING', // Note: keeping client's spelling as requested
    slug: 'master-planning'
  },
  {
    id: '02',
    title: 'SOCIAL',
    slug: 'social'
  },
  {
    id: '03',
    title: 'HOTEL - LEISURE',
    slug: 'hotel-leisure'
  },
  {
    id: '04',
    title: 'RESEDENTIAL', // Note: keeping client's spelling as requested
    slug: 'residential'
  },
  {
    id: '05',
    title: 'COMMERCIAL',
    slug: 'commercial'
  },
  {
    id: '06',
    title: 'TRANSPORTING',
    slug: 'transporting'
  }
];

export const getCategoryById = (id) => {
  return categories.find(category => category.id === id);
};

export const getCategoryBySlug = (slug) => {
  return categories.find(category => category.slug === slug);
};
