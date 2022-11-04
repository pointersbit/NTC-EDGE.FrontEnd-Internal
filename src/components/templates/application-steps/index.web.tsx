import React, { FC, ReactNode, useEffect, useRef } from 'react';
import {View,Text,useWindowDimensions} from 'react-native';
import Statusbar from '@atoms/status-bar';
import ProgressSteps from '@atoms/progress-steps';
import { Bottom } from '@molecules/buttons';
import buttonStyle from '@molecules/buttons/bottom/styles';
import styles from './styles';
import {Bold} from "@styles/font";
import Button from "@atoms/button";
import NTCAlert from '@atoms/alert';
import {button,text} from "@styles/color";
import CheveronLeftIcon from "@assets/svg/cheveron-left";
import CheveronRightIcon from "@assets/svg/cheveron-right";
import {useDispatch} from "react-redux";
import {setApplicationItem} from "../../../reducers/application/actions";

interface Steps {
  title?: string;
  content?: ReactNode;
  onPrevious?: any;
  onNext?: any;
  buttonLabel?: string;
  buttonDisabled?: boolean;
};

interface Props {
  tabview: JSX.Element,
  steps?: Steps[];
  currentStep?: number;
  completed?: boolean;
  onExit?: any;
  loading?: any;
  UDAAlert?: any;
};

const ApplicationSteps: FC<Props> = ({
                                       tabview,
  steps = [],
  currentStep = 0,
  completed,
  onExit = () => {},
  loading,
  UDAAlert = {},
}) => {
  const totalSteps = steps?.length;
  const current = steps?.[currentStep] || {};
  const {
    title = '',
    content = <View />,
    onPrevious = () => {},
    onNext = () => {},
    buttonLabel = 'OK',
    buttonDisabled,
  } = current;
  const dimensions=useWindowDimensions();
  const values = new Array(totalSteps - 1).fill(0).map((n, index) => { return index <= currentStep || completed ? 1 : 0; });
     const dispatch = useDispatch()
  if (!(totalSteps > 0)) return <View />;

  return (
      <>

        <View style={styles.mainContainer}>

          <NTCAlert
              alertContainerStyle={{zIndex: 2,}}
              visible={UDAAlert?.active}
              title={UDAAlert?.title || 'Alert'}
              message={UDAAlert?.message}
              confirmText='OK'
              onConfirm={UDAAlert?.onConfirm}
          />

          {
            completed
                ? <Statusbar barStyle='dark-content' backgroundColor='#fff' />
                : <View style={styles.title}>
                  <Text style={{fontSize: 20, color: "#113196", fontFamily: Bold}}>{title}</Text>
                  {
                    ((currentStep + 1) >= totalSteps) //currentStep is by index
                        ? <View />
                        : <View style={styles.progressContainer}>
                          <ProgressSteps values={values} />
                        </View>
                  }
                </View>
          }

          <View style={{flex: 1, overflow: "auto"}}>
            {tabview}
          </View>

          <View>
            <Bottom
                containerStyles={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
                buttonStyles={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                label={buttonLabel}
                icon={loading ? <Text></Text> :<View style={{paddingLeft: 14}}>
                  <CheveronLeftIcon color={ (buttonDisabled || loading) && text.disabled}  />
                </View>}
                onPress={onNext}
                disabled={buttonDisabled || loading}
                loading={loading}
            >
              <Button
                      style={[
                        buttonStyle.button,
                        loading && {backgroundColor: button.info},
                        {flexDirection: "row", justifyContent: "center", alignItems: "center"}
                      ]}
                      onPress={() =>{
                        onPrevious()
                      }}
                  >
                    <View style={{}}>
                      <CheveronRightIcon color={ loading ? "#fff" : "#2863D6"} />
                    </View>
                    {
                      <Text style={[
                        {

                          color: '#2863D6',

                          fontSize:16,
                          fontFamily: Bold
                        },
                        loading && {color: "#fff"},
                      ]}>
                        {"Back"}
                      </Text>
                    }
                  </Button>
            </Bottom>

          </View>

        </View>
      </>

  )
};

export default React.memo(ApplicationSteps);
