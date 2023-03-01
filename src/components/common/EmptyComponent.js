import { isNotUser } from "@/helpers";
import Pressable from "./Pressable";

const EmptyComponent = (props) => {
    let { onPrimaryTab, onViewAll, isDisableAddNew, title } = props;
    if (onPrimaryTab === 1 || onPrimaryTab === 2) {
        return (
            <div className='center flex-column align-items-center flex-grow-1'>
                <p className='C-dark signIn'>
                    {props.empty ?
                        `No ${onPrimaryTab === 1 ? 'Primary' : onPrimaryTab === 2 ? 'Secondary' : ''} ${title} Assigned!`
                        :
                        `${props.title} not found!`
                    }
                </p>
                <Pressable
                    title={'View All'}
                    titleStyle={{ fontSize: '1rem', width: '100px' }}
                    onPress={onViewAll}
                    classes='ps-3 pe-3 mt-3'
                >
                </Pressable>
                {props.onAddNew && <div>
                    <Pressable
                        title={`Add New `}
                        disabled={isDisableAddNew}
                        titleStyle={{ fontSize: '1rem', width: '100px' }}
                        onPress={props.onAddNew}
                        classes='ps-3 pe-3 mt-3'
                    >
                    </Pressable>
                </div>
                }

            </div>
        )
    }
    return (
        <div style={{ flex: '1'}} className='center flex-column align-items-center'>
            <p className='C-dark signIn'>
                {props.empty ?
                    `No ${title} registered!`
                    :
                    `${title} not found!`
                }
            </p>
            {props.onAddNew && isNotUser() && <div>
                <Pressable
                    title={`Add New ${title}`}
                    disabled={isDisableAddNew}
                    titleStyle={{ fontSize: '16px' }}
                    onPress={props.onAddNew}
                    classes='ps-3 pe-3 mt-3'
                >
                </Pressable>
            </div>
            }

        </div>
    )
}
export default EmptyComponent;