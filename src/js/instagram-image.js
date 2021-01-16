import { useDispatch, useSelect } from "@wordpress/data";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';
import { Fragment } from "@wordpress/element";
import {
    MediaUpload,
    MediaUploadCheck
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

const FoodblogkitchenInstagramImageSettingPanel = () => {
    const { meta } = useSelect(select => ({
        meta: select('core/editor').getEditedPostAttribute('meta')
    }));

    const { editPost } = useDispatch('core/editor');
    const setMeta = function (keyAndValue) {
        editPost({ meta: keyAndValue })
    }
    const ALLOWED_MEDIA_TYPES = ["image"];

    return (
        <PluginDocumentSettingPanel
            title={__("Pinterest image", 'foodblogkitchen-toolkit')}
        >
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={(media) => {
                        if (media) {
                            console.log(media);
                            setMeta({
                                foodblogkitchen_pinterest_image_id: media.id,
                                foodblogkitchen_pinterest_image_url: media.url,
                            });
                        }
                    }}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    value={meta.foodblogkitchen_pinterest_image_url}
                    render={({ open }) => (
                        <Fragment>
                            <img src={meta.foodblogkitchen_pinterest_image_url}
                                onClick={open}
                            />
                            <button type="button" className="components-button is-secondary" onClick={open}>{__("Select image", 'foodblogkitchen-toolkit')}</button>
                        </Fragment>
                    )}
                />
            </MediaUploadCheck>
        </PluginDocumentSettingPanel>
    )
}

registerPlugin('foodblogkitchen-setting-panel-instagram-image', {
    render: FoodblogkitchenInstagramImageSettingPanel,
    icon: false
})