import { Model }    from "../firebase/database";
import AuthProfiles from "./auth-profiles";

const get_current_session = async (key: string) => {
    if( !key )
        return { code: 721, msg: 'Missing auth key' };

    try {
        const sessions = new Model('serviroutes_Sessions');

        const session_to_find = await sessions.get_by_id(key);

        if( !session_to_find ) 
            return { code: 723, msg: 'Session not exists' };
            
        const session_status = session_to_find['status'];


        if( session_status !== AuthProfiles.ACTIVE ) {
            const reason = `User is not active, current status: ${session_status}`;
            return { code: 722, msg: reason };
        }

        return { code: null, msg: session_to_find };

    } catch(e) {
        console.log(`sessions get_current_session error ${e}`);
        return { code: 724, msg: 'Caught exception' };
        
    }
}

export {
    get_current_session
}
