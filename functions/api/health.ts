// @ts-nocheck
import { json } from '../_shared';

export const onRequestGet: PagesFunction = async () => {
  return json({ ok: true });
};
