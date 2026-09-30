//get recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const email = req.body.email;

    const specificUser = await UserProfile.findOne({
      'User.Personal_info.Email': email
    }).lean();

    console.log(specificUser);

    if (!specificUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const username = specificUser.User.Personal_info.Username;

    const allusers = await UserProfile.find({}).lean();

    console.log({
      username: username,
      usersdata: allusers
    });

    // Try recommendation API up to 3 times
    let flaskResponse;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        flaskResponse = await axios.post(
          'https://skillxchange-dvdu.onrender.com/api/getrecommendations',
          {
            username: username,
            usersdata: allusers
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 60000
          }
        );

        // Request succeeded
        break;

      } catch (error) {
        console.log(
          `Recommendation API attempt ${attempt} failed`
        );

        if (attempt === 3) {
          throw error;
        }

        // Wait 5 seconds before trying again
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    const recommendationsresponse = flaskResponse.data;

    const usernames = recommendationsresponse.map(
      tuple => tuple[0]
    );

    const userProfilePromises = usernames.map(username =>
      UserProfile.findOne({
        "User.Personal_info.Username": username
      }).exec()
    );

    const UserProfiles = await Promise.all(userProfilePromises);

    res.json(UserProfiles);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});