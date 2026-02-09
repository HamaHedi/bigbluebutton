import React from "react";
import { useMutation } from "@apollo/client";
import ScreenshareButton from "./component";
import { useIsScreenSharingEnabled } from "/imports/ui/services/features";
import {
  useIsScreenBroadcasting,
  useIsScreenGloballyBroadcasting,
} from "/imports/ui/components/screenshare/service";
import useSettings from "/imports/ui/services/settings/hooks/useSettings";
import { SETTINGS } from "/imports/ui/services/settings/enums";
import { SET_PRESENTER } from "/imports/ui/core/graphql/mutations/userMutations";
import Auth from "/imports/ui/services/auth";

const ScreenshareButtonContainer = (props) => {
  const { viewScreenshare: screenshareDataSavingSetting } = useSettings(
    SETTINGS.DATA_SAVING,
  );
  const screenIsBroadcasting = useIsScreenBroadcasting();
  const { screenIsShared: isScreenGloballyBroadcasting } =
    useIsScreenGloballyBroadcasting();
  const enabled = useIsScreenSharingEnabled();
  const [setPresenter] = useMutation(SET_PRESENTER);

  const handleTakePresenter = () => {
    return setPresenter({ variables: { userId: Auth.userID } });
  };

  return (
    <ScreenshareButton
      screenshareDataSavingSetting={screenshareDataSavingSetting}
      isScreenBroadcasting={screenIsBroadcasting}
      isScreenGloballyBroadcasting={isScreenGloballyBroadcasting}
      enabled={enabled}
      handleTakePresenter={handleTakePresenter}
      {...props}
    />
  );
};

/*
 * All props, including the ones that are inherited from actions-bar
 * isScreenBroadcasting,
 * amIPresenter,
 * amIModerator,
 * screenSharingCheck,
 * screenshareDataSavingSetting,
 * handleTakePresenter,
 */
export default ScreenshareButtonContainer;
