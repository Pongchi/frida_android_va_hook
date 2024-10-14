// Hooking the Java class constructor in Frida
Java.perform(function () {
    // 대상 클래스의 전체 패키지 경로를 입력하세요
    var MessageClass = Java.use('com.discord.chat.bridge.Message'); 

    // Message 클래스의 생성자를 후킹합니다
    MessageClass.$init.overload('com.discord.chat.bridge.MessageType', 'java.lang.String', 'java.lang.String', 'long', 'com.discord.primitives.GuildId', 'com.discord.chat.bridge.MessageState', 'com.discord.primitives.UserId', 'long', 'java.lang.String', 'java.lang.Integer', 'java.lang.Float', 'java.lang.Integer', 'java.lang.Integer', 'java.lang.String', 'java.lang.Integer', 'java.lang.String', 'java.lang.Integer', 'java.lang.Integer', 'boolean', 'boolean', 'java.lang.Integer', 'java.lang.String', 'java.lang.String', 'java.util.List', 'java.util.List', 'java.lang.Float', 'com.discord.chat.bridge.structurabletext.StructurableText', 'java.util.List', 'java.util.List', 'java.lang.Boolean', 'java.util.List', 'com.discord.chat.bridge.activities.ActivityInstanceEmbed', 'java.util.List', 'com.discord.chat.bridge.roleicons.RoleIcon', 'com.discord.chat.bridge.connectionsroletag.ConnectionsRoleTag', 'com.discord.chat.bridge.threads.ThreadEmbed', 'boolean', 'java.lang.Boolean', 'java.lang.Boolean', 'java.lang.Boolean', 'com.discord.chat.bridge.referencedmessage.ReferencedMessage', 'com.discord.chat.bridge.executedcommand.ExecutedCommand', 'java.util.List', 'java.lang.String', 'java.lang.Boolean', 'java.lang.String', 'java.lang.Boolean', 'java.lang.Integer', 'java.lang.Integer', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'com.discord.chat.bridge.ephemeral.EphemeralIndication', 'com.discord.chat.bridge.feedback.SurveyIndication', 'com.discord.chat.bridge.interaction.InteractionStatus', 'java.lang.Boolean', 'java.lang.Boolean', 'java.lang.Boolean', 'java.lang.String', 'java.lang.Boolean', 'java.lang.String', 'java.lang.String', 'java.util.List', 'java.lang.Boolean', 'java.lang.Boolean', 'java.lang.Long', 'com.discord.chat.bridge.sticker.Sticker', 'java.lang.String', 'java.lang.String', 'java.lang.Boolean', 'com.discord.chat.bridge.activities.ActivityInviteEmbed', 'boolean', 'com.discord.chat.bridge.forums.ForumPostActions', 'com.discord.chat.bridge.automod.AutoModerationContext', 'java.util.List', 'com.discord.chat.bridge.gift.GiftEmbed', 'java.lang.Integer', 'java.util.List', 'com.discord.chat.bridge.channelprompt.ChannelPromptData', 'com.discord.chat.bridge.policynotice.SafetyPolicyNoticeEmbed', 'com.discord.chat.bridge.safetysystemnotification.SafetySystemNotificationEmbed', 'com.discord.chat.bridge.polls.PollData', 'com.discord.chat.bridge.ctabutton.CtaButton', 'com.discord.chat.bridge.voiceinviteembed.VoiceInviteEmbed', 'java.lang.Integer', 'com.discord.chat.bridge.forwarding.ForwardInfo', 'java.lang.Boolean', 'com.discord.primitives.GuildId', 'java.lang.String', 'java.lang.String', 'java.lang.String').implementation = function (messageType, id, nonce, channelId, guildId, messageState, authorId, flags, edited, editedColor, constrainedWidth, textColor, linkColor, timestamp, timestampColor, username, usernameColor, roleColor, shouldShowRoleDot, shouldShowRoleOnName, colorString, avatarURL, avatarDecorationURL, embeds, attachments, attachmentsOpacity, content, progress, reactions, useAddBurstReaction, codedLinks, activityInstanceEmbed, stickers, roleIcon, connectionsRoleTag, threadEmbed, mentioned, gifAutoPlay, animateEmoji, showLinkDecorations, referencedMessage, executedCommand, components, threadStarterMessageHeader, communicationDisabled, tagText, tagVerified, tagTextColor, tagBackgroundColor, tagType, tagIconUrl, opTagText, ephemeralIndication, surveyIndication, interactionStatus, useAttachmentGridLayout, useAttachmentUploadPreview, isCurrentUserMessageAuthor, obscureLearnMoreLabel, usingGradientTheme, title, description, avatarURLs, isCallActive, missed, rawMilliseconds, sticker, stickerLabel, buttonLabel, showInviteToSpeakButton, activityInviteEmbed, isFirstForumPostMessage, postActions, autoModerationContext, giftCodes, referralTrialOffer, totalMonthsSubscribed, postPreviewEmbeds, channelPromptData, safetyPolicyNoticeEmbed, safetySystemNotificationEmbed, pollData, ctaButton, voiceChannelInviteEmbed, audioAttachmentBackgroundColor, forwardInfo, showInlineForwardButton, clanTagGuildId, clanTag, clanBadgeUrl, gameApplicationId) {
        // 원래 생성자 호출
        var obj = this.$init(messageType, id, nonce, channelId, guildId, messageState, authorId, flags, edited, editedColor, constrainedWidth, textColor, linkColor, timestamp, timestampColor, username, usernameColor, roleColor, shouldShowRoleDot, shouldShowRoleOnName, colorString, avatarURL, avatarDecorationURL, embeds, attachments, attachmentsOpacity, content, progress, reactions, useAddBurstReaction, codedLinks, activityInstanceEmbed, stickers, roleIcon, connectionsRoleTag, threadEmbed, mentioned, gifAutoPlay, animateEmoji, showLinkDecorations, referencedMessage, executedCommand, components, threadStarterMessageHeader, communicationDisabled, tagText, tagVerified, tagTextColor, tagBackgroundColor, tagType, tagIconUrl, opTagText, ephemeralIndication, surveyIndication, interactionStatus, useAttachmentGridLayout, useAttachmentUploadPreview, isCurrentUserMessageAuthor, obscureLearnMoreLabel, usingGradientTheme, title, description, avatarURLs, isCallActive, missed, rawMilliseconds, sticker, stickerLabel, buttonLabel, showInviteToSpeakButton, activityInviteEmbed, isFirstForumPostMessage, postActions, autoModerationContext, giftCodes, referralTrialOffer, totalMonthsSubscribed, postPreviewEmbeds, channelPromptData, safetyPolicyNoticeEmbed, safetySystemNotificationEmbed, pollData, ctaButton, voiceChannelInviteEmbed, audioAttachmentBackgroundColor, forwardInfo, showInlineForwardButton, clanTagGuildId, clanTag, clanBadgeUrl, gameApplicationId);

        // 생성된 객체의 필드를 출력
        console.log('Message object created: ' + JSON.stringify(this));

        return obj;
    };
});