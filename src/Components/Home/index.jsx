import React from 'react';
import bluejay from './images/bluejay.svg';
import './style.scss';

import {
  useTranslation,
} from 'react-i18next';

function Home() {
  const { t } = useTranslation('common');

  return (
    <div id="tab-landing">
      <div className="content_wrapper">
        <div className="content_top">
          <div
            align="center"
            className="logowrapper"
          >
            <div
              align="center"
              dangerouslySetInnerHTML={{ __html: t('homeWelcome') }}
            />

            <div
              align="center"
              dangerouslySetInnerHTML={{ __html: t('betaWarning') }}
            />
          </div>
        </div>

        <div className="content_mid">
          <div className="column third_left text1">
            <div className="wrap">
              <h2>
                {t('homeDisclaimerHeader')}
              </h2>

              <div dangerouslySetInnerHTML={{ __html: t('homeDisclamierText') }} />
            </div>
          </div>

          <div className="column third_center text2">
            <div className="wrap">

              <h2>
                {t('homeExperimental')}
              </h2>

              <div>
                {t('homeVersionInfo')}

                <ul>
                  <li>
                    <a
                      href="https://github.com/bitdump/BLHeli"
                      rel="noreferrer"
                      target="_blank"
                    >
                      BLHELI_S
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://github.com/mathiasvr/bluejay"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Bluejay
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://github.com/AlkaMotors/AM32-MultiRotor-ESC-firmware"
                      rel="noreferrer"
                      target="_blank"
                    >
                      AM32
                    </a>
                  </li>
                </ul>
              </div>

              <div className="firmware-logo-bar">
                <div>

                  <img
                    alt="Bluejay"
                    src={bluejay}
                  />
                </div>
              </div>

              <h3>
                Bluejay
              </h3>

              <div dangerouslySetInnerHTML={{ __html: t('bluejayText') }} />

              <br />

              <h3>
                AM32
              </h3>

              <div dangerouslySetInnerHTML={{ __html: t('blheli32ToAM32') }} />
            </div>
          </div>

          <div className="column third_right text3">
            <h2>
              {t('homeContributionHeader')}
            </h2>

            <div dangerouslySetInnerHTML={{ __html: t('homeContributionText') }} />
          </div>
        </div>

        <div className="content_foot" />
      </div>
    </div>
  );
}

export default Home;
