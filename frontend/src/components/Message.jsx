/* eslint-disable react/prop-types */
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { selectedConversationsAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationsAtom);
  const user = useRecoilValue(userAtom);

  return (
    <Flex gap={2} alignSelf={ownMessage ? "flex-end" : "flex-start"}>
      {ownMessage ? (
        <>
          <Flex gap={2} alignSelf={"flex-end"}>
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          </Flex>
          <Avatar src={user.profilePic || ""} w="7" h="7" />
        </>
      ) : (
        <>
          <Avatar src={selectedConversation.userProfilePic || ""} w="7" h="7" />
          <Text
            maxW={"350px"}
            bg={"gray.400"}
            p={1}
            borderRadius={"md"}
            color="black"
          >
            {message.text}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default Message;
