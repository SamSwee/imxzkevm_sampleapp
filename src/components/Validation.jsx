import * as jose from 'jose';

export async function validateJWT(jwt){
  const JWKS = jose.createRemoteJWKSet(new URL('https://auth.immutable.com/.well-known/jwks.json'));
  const { payload } = await jose.jwtVerify(jwt, JWKS);
  return payload;
}
