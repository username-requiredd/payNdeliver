export const GET = async (req, { params }) => {
    const { id } = params;

    try {
        await dbConnect();

        // Count unread notifications
        const unreadCount = await notifications.countDocuments({
            userId: new ObjectId(id),
            read: false,
        });

        return NextResponse.json(
            { message: "Unread notifications count retrieved!", count: unreadCount },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};
