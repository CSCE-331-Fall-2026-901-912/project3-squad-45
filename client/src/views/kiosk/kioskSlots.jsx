// Teammates add kiosk features by dropping a file into one of these folders; nothing
// else has to be edited, which keeps their commits independent.
//
//   providers/*Provider.jsx  wrap the whole kiosk and receive `children`
//   toolbar/*Tool.jsx        render inside the header toolbar
//   home/*Section.jsx        render as a section of the home page
//   overlays/*Overlay.jsx    render above the page (chat button, dialogs)
//
// Home sections and overlays receive { products, options, cart, onSelectProduct }.
const toComponents = (modules) =>
  Object.keys(modules).sort().map((path) => ({ key: path, Component: modules[path].default }));

export const providers = toComponents(import.meta.glob('./providers/*Provider.jsx', { eager: true }));
export const tools = toComponents(import.meta.glob('./toolbar/*Tool.jsx', { eager: true }));
export const homeSections = toComponents(import.meta.glob('./home/*Section.jsx', { eager: true }));
export const overlays = toComponents(import.meta.glob('./overlays/*Overlay.jsx', { eager: true }));

// Nests every provider around `children`, first file outermost.
export function wrapWithProviders(children) {
  return providers.reduceRight((inner, { key, Component }) => <Component key={key}>{inner}</Component>, children);
}
