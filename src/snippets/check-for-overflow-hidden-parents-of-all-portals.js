window.park.$('.park-portal').forEach((portal) => {
  const problematicParents = window.park.$('*').filter(elem => elem.contains(portal)).filter(elem => window.getComputedStyle(elem).getPropertyValue('overflow') === 'hidden');
  if (problematicParents.length) {
    window.park.console.warn('Sticky will break in portal:', portal, problematicParents);
  } else {
    window.park.console.info('Sticky will work in portal:', portal);
  }
});
