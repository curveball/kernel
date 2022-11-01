let globalOrigin:string|null = null;

/**
 * This function is the standard altogrithm to 'guess' the origin of where
 * a curveball app is running.
 *
 * The origin is 'base url', but more specifically it's the URL right up the
 * end of the path.
 *
 * For example: http://localhost is an origin, but https://localhost/ is not.
 *
 * Knowning where a server is running is often useful. We don't want to
 * auto-detect it based on the request, because we can't absolutely trust it.
 *
 * If the origin was detected wrong, set the CURVEBALL_ORIGIN environemtn
 * variable.
 */
export function getGlobalOrigin(): string {

  if (globalOrigin) {
    return globalOrigin;
  }

  if (process.env.CURVEBALL_ORIGIN) {
    return process.env.CURVEBALL_ORIGIN;
  }

  if (process.env.PUBLIC_URI) {
    return new URL(process.env.PUBLIC_URI).origin;
  }

  const port = process.env.PORT ? +process.env.PORT : 80;
  return 'http://localhost' + (port!==80?':' + port : '');

}

/**
 * Overrides the global origin
 */
export function setGlobalOrigin(origin: string): void {

  globalOrigin = origin;

}
