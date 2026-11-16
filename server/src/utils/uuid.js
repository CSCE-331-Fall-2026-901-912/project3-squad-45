const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Browser-generated anonymous ids (device and game player ids) must be UUIDs.
export const isUuid = (value) => typeof value === 'string' && UUID_PATTERN.test(value);
