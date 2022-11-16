const ActiveCursor = (props: any) => {
    return (
        <span
            onMouseEnter={props.textEnter}
            onMouseLeave={props.textLeave}
        >
            {props.children}
        </span>
    );
}

export default ActiveCursor;