'use client';

import { memo } from 'react';


// const UpgradeAlert = memo(() => {
//   const [hasNewVersion, latestVersion] = useGlobalStore((s) => [s.hasNewVersion, s.latestVersion]);
//   const { t } = useTranslation('common');

//   if (!hasNewVersion) return;

//   return (
//     <Alert
//       closable
//       message={
//         <Flexbox gap={8}>
//           <p>{t('upgradeVersion.newVersion', { version: `v${latestVersion}` })}</p>
//           <Link
//             aria-label={t('upgradeVersion.action')}
//             href={MANUAL_UPGRADE_URL}
//             style={{ marginBottom: 6 }}
//             target={'_blank'}
//           >
//             <Button block size={'small'} type={'primary'}>
//               {t('upgradeVersion.action')}
//             </Button>
//           </Link>
//         </Flexbox>
//       }
//       type={'info'}
//     />
//   );
// });

const UpgradeAlert = memo(() => {
  // const [hasNewVersion, latestVersion] = useGlobalStore((s) => [s.hasNewVersion, s.latestVersion]);
  // // const { t } = useTranslation('common');

  // if (!hasNewVersion) return null;

  return null;
});

export default UpgradeAlert;
